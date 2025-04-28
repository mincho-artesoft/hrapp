import UIKit

// MARK: — Centered Email Picker
class EmailPickerViewController: UIViewController, UITableViewDataSource, UITableViewDelegate {
    private let emails: [String]
    private var selectedIndex: Int? = nil

    private let containerView = UIView()
    private let titleLabel = UILabel()
    private let tableView = UITableView()
    private let confirmButton = UIButton(type: .system)

    init(emails: [String]) {
        self.emails = emails
        super.init(nibName: nil, bundle: nil)
        modalPresentationStyle = .overCurrentContext
    }
    required init?(coder: NSCoder) { fatalError() }

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = UIColor.black.withAlphaComponent(0.4)

        // Container
        containerView.backgroundColor = .white
        containerView.layer.cornerRadius = 12
        containerView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(containerView)

        // Title
        titleLabel.text = "Select Your Email"
        titleLabel.textAlignment = .center
        titleLabel.font = .boldSystemFont(ofSize: 17)
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(titleLabel)

        // Table
        tableView.dataSource = self
        tableView.delegate   = self
        tableView.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(tableView)

        // Confirm
        confirmButton.setTitle("Confirm", for: .normal)
        confirmButton.isEnabled = false
        confirmButton.addTarget(self, action: #selector(onConfirm), for: .touchUpInside)
        confirmButton.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(confirmButton)

        // Layout
        NSLayoutConstraint.activate([
            // container size & centering
            containerView.widthAnchor.constraint(equalToConstant: 300),
            containerView.heightAnchor.constraint(equalToConstant: 400),
            containerView.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            containerView.centerYAnchor.constraint(equalTo: view.centerYAnchor),

            // title at top
            titleLabel.topAnchor.constraint(equalTo: containerView.topAnchor, constant: 16),
            titleLabel.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 16),
            titleLabel.trailingAnchor.constraint(equalTo: containerView.trailingAnchor, constant: -16),

            // table below title
            tableView.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 8),
            tableView.leadingAnchor.constraint(equalTo: containerView.leadingAnchor),
            tableView.trailingAnchor.constraint(equalTo: containerView.trailingAnchor),
            tableView.bottomAnchor.constraint(equalTo: confirmButton.topAnchor, constant: -8),

            // confirm at bottom
            confirmButton.bottomAnchor.constraint(equalTo: containerView.bottomAnchor, constant: -16),
            confirmButton.centerXAnchor.constraint(equalTo: containerView.centerXAnchor)
        ])
    }

    // MARK: UITableViewDataSource
    func tableView(_ tv: UITableView, numberOfRowsInSection section: Int) -> Int {
        emails.count
    }
    func tableView(_ tv: UITableView, cellForRowAt idx: IndexPath) -> UITableViewCell {
        let cell = tv.dequeueReusableCell(withIdentifier: "cell") ?? UITableViewCell(style: .default, reuseIdentifier: "cell")
        cell.textLabel?.text = emails[idx.row]
        cell.accessoryType = (idx.row == selectedIndex) ? .checkmark : .none
        return cell
    }

    // MARK: UITableViewDelegate
    func tableView(_ tv: UITableView, didSelectRowAt idx: IndexPath) {
        selectedIndex = idx.row
        confirmButton.isEnabled = true
        tv.reloadData()
    }

    @objc private func onConfirm() {
        guard let idx = selectedIndex else { return }
        GlobalState.email = emails[idx]
        dismiss(animated: true, completion: nil)
    }
}
